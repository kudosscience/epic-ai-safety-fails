# Product Backlog

| ID | Actor | User Story | Status | Conditions of Satisfaction (CoS) |
| :-- | :-- | :-- | :-- | :-- |
| 1 | AI safety researcher | As an invited researcher, I can create an account with human verification and log AI tooling failures so the community can search, discuss, and prioritize them. [View Details](./1/prd.md) | InProgress | Invite-only signup with reCAPTCHA, log submission with structured fields including time wasted, contribution profiles, leaderboard, moderation queue with hide-on-flag behavior. |
| 2 | Maintainer | As a maintainer, I can deploy a public test environment with clear validation steps so we can validate onboarding and diagnose signup issues. [View Details](./2/prd.md) | Agreed | Deployment plan for lowest-cost hosting, environment setup, and validation checklist; separate signup payload diagnosis task documented. |
| 3 | Researcher | As an existing user, I can log in with my credentials so I can access my account and contribute. [View Details](./3/prd.md) | Agreed | Login page with email/password, Supabase Auth sign-in, error handling, and a Log In header link for signed-out users. |

## PBI History

| Timestamp | PBI_ID | Event_Type | Details | User |
| :-- | :-- | :-- | :-- | :-- |
| 20260419-190806 | 1 | create_pbi | Initial PBI created from implementation planning discussion. | henry |
| 20260419-190806 | 1 | propose_for_backlog | PBI accepted for implementation. | henry |
| 20260419-190806 | 1 | start_implementation | Implementation started with task 1-1. | ai-agent |
| 20260509-123000 | 2 | create_pbi | PBI created to plan public test deployment. | henry |
| 20260509-123100 | 2 | propose_for_backlog | PBI approved for planning tasks. | henry |
| 20260509-161500 | 3 | create_pbi | PBI created to add a login page for existing users. | henry |
| 20260509-161530 | 3 | propose_for_backlog | PBI approved for implementation. | henry |