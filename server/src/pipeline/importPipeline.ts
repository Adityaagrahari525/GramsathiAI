import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { IScheme, Scheme } from '../models/Scheme.js';
import { SchemeNormalizer } from './normalizer.js';
import { SchemeValidator, ValidationResult } from './validator.js';
import { SchemeDeduplicator, DuplicateMatch } from './deduplicator.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PipelineStats {
  timestamp: string;
  sourceFile: string;
  isDryRun: boolean;
  totalRecordsProcessed: number;
  normalizedCount: number;
  validCount: number;
  rejectedCount: number;
  duplicateCount: number;
  verifiedCount: number;
  unverifiedCount: number;
  maharashtraCount: number;
  otherStatesCount: number;
  databaseUpsertedCount: number;
  rejections: { schemeId: string; schemeName: string; errors: string[] }[];
  duplicates: DuplicateMatch[];
}

export class SchemeImportPipeline {
  private deduplicator = new SchemeDeduplicator();

  public async run(options: {
    sourcePath?: string;
    dryRun?: boolean;
    stateFilter?: string;
    limit?: number;
  }): Promise<PipelineStats> {
    const isDryRun = options.dryRun !== false; // Default true (safe)
    const sourceFile = options.sourcePath || path.resolve(__dirname, '../data/samples/maharashtra_verified_schemes.json');
    const stateFilter = options.stateFilter || 'Maharashtra';
    const limit = options.limit || Infinity;

    console.log('='.repeat(70));
    console.log(`GRAMSATHI AI — GOVERNMENT SCHEME IMPORT PIPELINE`);
    console.log(`Mode:        ${isDryRun ? 'DRY-RUN (No database writes)' : 'LIVE EXECUTION'}`);
    console.log(`Source:      ${sourceFile}`);
    console.log(`State Filter: ${stateFilter}`);
    console.log('='.repeat(70));

    if (!fs.existsSync(sourceFile)) {
      throw new Error(`Source file not found at: ${sourceFile}`);
    }

    const rawContent = fs.readFileSync(sourceFile, 'utf-8');
    let rawRecords: any[] = [];

    if (sourceFile.endsWith('.json')) {
      const parsed = JSON.parse(rawContent);
      rawRecords = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      // Basic CSV parser or JSON fallback
      throw new Error(`Unsupported file extension for direct parsing. Please provide a .json file.`);
    }

    const stats: PipelineStats = {
      timestamp: new Date().toISOString(),
      sourceFile: path.basename(sourceFile),
      isDryRun,
      totalRecordsProcessed: 0,
      normalizedCount: 0,
      validCount: 0,
      rejectedCount: 0,
      duplicateCount: 0,
      verifiedCount: 0,
      unverifiedCount: 0,
      maharashtraCount: 0,
      otherStatesCount: 0,
      databaseUpsertedCount: 0,
      rejections: [],
      duplicates: []
    };

    const validSchemesToStore: any[] = [];

    for (let i = 0; i < rawRecords.length && i < limit; i++) {
      const raw = rawRecords[i];
      stats.totalRecordsProcessed++;

      // 1. Normalization
      let normalized: any;
      try {
        normalized = SchemeNormalizer.normalize(raw, {
          sourceName: raw.governance?.dataCollectionSource || 'Curated Sample',
          defaultState: stateFilter === 'all' ? undefined : stateFilter,
          sourceUrl: raw.governance?.officialSourceUrl || 'https://mahadbt.maharashtra.gov.in/'
        });
        stats.normalizedCount++;
      } catch (err: any) {
        stats.rejectedCount++;
        stats.rejections.push({
          schemeId: raw.schemeId || `ROW_${i}`,
          schemeName: raw.name || 'Unknown',
          errors: [`Normalization exception: ${err.message}`]
        });
        continue;
      }

      // Filter by state if specified
      if (stateFilter !== 'all' && normalized.state !== stateFilter && normalized.level !== 'Central') {
        stats.otherStatesCount++;
        continue;
      }

      if (normalized.state === 'Maharashtra' || normalized.level === 'Central') {
        stats.maharashtraCount++;
      } else {
        stats.otherStatesCount++;
      }

      // 2. Validation against 10 Data Rules
      const validation: ValidationResult = SchemeValidator.validate(normalized);
      if (!validation.isValid) {
        stats.rejectedCount++;
        stats.rejections.push({
          schemeId: normalized.schemeId,
          schemeName: normalized.name,
          errors: validation.issues.filter(iss => iss.severity === 'error').map(iss => `[${iss.rule}] ${iss.field}: ${iss.message}`)
        });
        continue;
      }

      // 3. Deduplication
      const dupCheck = this.deduplicator.findDuplicate(normalized);
      if (dupCheck.isDuplicate && dupCheck.match) {
        stats.duplicateCount++;
        stats.duplicates.push(dupCheck.match);
        // Apply safe merge if applicable
        const merged = this.deduplicator.merge(dupCheck.existing!, normalized, dupCheck.match.resolution);
        this.deduplicator.register(merged);
        continue;
      } else {
        this.deduplicator.register(normalized);
      }

      // Track verification status
      if (normalized.governance?.verificationStatus === 'officially_verified') {
        stats.verifiedCount++;
      } else {
        stats.unverifiedCount++;
      }

      stats.validCount++;
      validSchemesToStore.push(normalized as IScheme);
    }

    // 4. Live DB Execution (if not dry-run)
    if (!isDryRun) {
      console.log(`\nAttempting database connection for live import of ${validSchemesToStore.length} schemes...`);
      const connected = await connectDatabase();
      if (!connected) {
        console.error('Cannot perform live import: MongoDB is not connected or credentials not provided.');
        stats.databaseUpsertedCount = 0;
      } else {
        for (const item of validSchemesToStore) {
          try {
            await Scheme.findOneAndUpdate(
              { schemeId: item.schemeId },
              { $set: item },
              { upsert: true, new: true, runValidators: true }
            );
            stats.databaseUpsertedCount++;
          } catch (dbErr: any) {
            console.error(`Failed to upsert scheme ${item.schemeId}:`, dbErr.message);
          }
        }
        await disconnectDatabase();
      }
    }

    // 5. Generate and Save Reports
    this.writeReports(stats);

    // 6. Terminal Summary Display
    this.printSummary(stats);

    return stats;
  }

  private writeReports(stats: PipelineStats): void {
    const reportDir = path.resolve(__dirname, '../../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Write JSON audit log
    const jsonPath = path.join(reportDir, 'import_audit_latest.json');
    fs.writeFileSync(jsonPath, JSON.stringify(stats, null, 2), 'utf-8');

    // Write Markdown report
    const mdPath = path.join(reportDir, 'DATASET_VALIDATION_REPORT.md');
    const mdContent = `# GramSathi AI — Scheme Dataset Validation & Audit Report

**Generated:** ${stats.timestamp}  
**Source Dataset:** \`${stats.sourceFile}\`  
**Execution Mode:** ${stats.isDryRun ? '🛡️ DRY-RUN (Zero DB modification)' : '⚡ LIVE DATABASE UPSERT'}

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Processed** | ${stats.totalRecordsProcessed} | 100.0% |
| **Successfully Normalized** | ${stats.normalizedCount} | ${((stats.normalizedCount / (stats.totalRecordsProcessed || 1)) * 100).toFixed(1)}% |
| **Passed Validation (Valid)** | ${stats.validCount} | ${((stats.validCount / (stats.totalRecordsProcessed || 1)) * 100).toFixed(1)}% |
| **Rejected / Invalid** | ${stats.rejectedCount} | ${((stats.rejectedCount / (stats.totalRecordsProcessed || 1)) * 100).toFixed(1)}% |
| **Duplicates Detected** | ${stats.duplicateCount} | - |
| **Officially Verified Records** | ${stats.verifiedCount} | ${((stats.verifiedCount / (stats.validCount || 1)) * 100).toFixed(1)}% |
| **Unverified / Scraped Records** | ${stats.unverifiedCount} | ${((stats.unverifiedCount / (stats.validCount || 1)) * 100).toFixed(1)}% |
| **Live Database Upserts** | ${stats.databaseUpsertedCount} | - |

---

## 2. 10 Data Rules Compliance

1. **No Fabrication**: All scheme IDs, benefits, and rules originate from verified official gazettes or stated source metadata.
2. **No Inferring Missing Criteria**: Unstated age, income, and caste requirements remain \`null\` and never default to arbitrary limits.
3. **Preserve Original Text**: Full raw eligibility narrative preserved in \`eligibility.rawText\`.
4. **Structured vs Unparsed Separation**: Machine-readable rule engines query \`eligibility.structured\` while legal caveats live in raw text.
5. **Null Preservation**: Missing document checklists or income caps stay \`null\`.
6. **Source Attribution**: Every record retains its \`officialSourceUrl\` and \`dataCollectionSource\`.
7. **Deduplication**: Multi-key resolution (ID, slug, normalized title) prevents duplicate schemes.
8. **Date Tracking**: Timestamps recorded in \`governance.dataCollectionDate\` and \`governance.lastVerifiedDate\`.
9. **No Unverified Elevation**: Records without .gov.in/.nic.in provenance or Government Resolution (GR) cannot be marked as \`verified\`.
10. **Licensing**: Source licenses documented and respected.

---

## 3. Rejected Records Log
${
  stats.rejections.length === 0
    ? '_No records were rejected during this run._'
    : stats.rejections
        .map(
          r => `### \`${r.schemeId}\` — ${r.schemeName}
${r.errors.map(e => `- ❌ ${e}`).join('\n')}`
        )
        .join('\n\n')
}

---

## 4. Duplicates & Merge Resolution Log
${
  stats.duplicates.length === 0
    ? '_No duplicate conflicts detected._'
    : stats.duplicates
        .map(
          d => `- **${d.incomingName}** (\`${d.incomingId}\`) matches **${d.existingName}** (\`${d.existingId}\`)
  - Match Type: \`${d.matchType}\` (Confidence: ${(d.confidence * 100).toFixed(0)}%)
  - Resolution: \`${d.resolution}\``
        )
        .join('\n')
}
`;

    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    console.log(`\nAudit reports saved to:`);
    console.log(`- ${jsonPath}`);
    console.log(`- ${mdPath}`);
  }

  private printSummary(stats: PipelineStats): void {
    console.log('\n' + '='.repeat(70));
    console.log('IMPORT PIPELINE RUN SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Records Examined:    ${stats.totalRecordsProcessed}`);
    console.log(`Successfully Normalized:    ${stats.normalizedCount}`);
    console.log(`Valid Records:             ${stats.validCount}`);
    console.log(`Rejected Records:          ${stats.rejectedCount}`);
    console.log(`Duplicates Handled:        ${stats.duplicateCount}`);
    console.log(`Verified Maharashtra:     ${stats.verifiedCount}`);
    console.log(`Database Upserts (Live):   ${stats.databaseUpsertedCount}`);
    console.log('='.repeat(70));
  }
}

// Direct CLI Execution Handler
if (process.argv[1] && process.argv[1].endsWith('importPipeline.ts')) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--execute') && !args.includes('--no-dry-run');
  const sourceArg = args.find(a => a.startsWith('--source='));
  const sourcePath = sourceArg ? sourceArg.split('=')[1] : undefined;

  const pipeline = new SchemeImportPipeline();
  pipeline.run({ dryRun, sourcePath }).catch(err => {
    console.error('Pipeline execution failed:', err);
    process.exit(1);
  });
}
