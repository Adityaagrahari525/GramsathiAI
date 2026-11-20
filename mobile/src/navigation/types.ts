export type RootStackParamList = {
  MainTabs: undefined;
  SchemeDetail: { id: string; schemeTitle?: string };
  EligibilityResults: { results: any };
  SignIn: undefined;
  Register: undefined;
  Tracker: undefined;
  SavedSchemes: undefined;
  Profile: undefined;
  NeedDiscovery: undefined;
  BenefitSynergy: undefined;
  FraudChecker: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SchemesTab: { sector?: string; search?: string } | undefined;
  EligibilityTab: undefined;
  AssistantTab: undefined;
  MoreTab: undefined;
};
