---
title: Canna ID 360™ - National Cannabis User Credential System
status: in_progress
priority: high
type: feature
tags: [government, identity, privacy, verification]
created_by: agent
created_at: 2026-08-21T05:35:13Z
position: 2
---

## Notes

Privacy-focused national cannabis user credential system that allows government authorities to issue secure digital IDs to eligible cannabis users. The system produces electronic credentials (digital ID, PVC card, QR-enabled) while minimizing data exposure at point of verification.

**Privacy Architecture:**
- Dispensaries only see: "Eligible? YES/NO"
- No exposure of: Full national ID, medical diagnosis, doctor's notes, purchase history, unrelated personal info

**Credential Format:**
- Digital ID / mobile credential
- Electronic PVC card
- QR-enabled credential  
- Secure verification record within Canna Blaze 360™
- Format determined by issuing government/authority

**User Requirements:**
- National ID number
- Age verification (21+)
- Date of birth
- Gender
- Jurisdiction/region

**Credential Information:**
- Name (verified)
- DOB (verified)
- Eligibility status
- Jurisdiction
- Credential Number (CB360-XXXXXXXX format)
- Issue date
- Expiration date
- QR/Secure verification code

## Checklist

- [x] Create database schema for canna_id_credentials
- [x] Create government issuance interface
- [x] Create user digital ID view page
- [x] Create retailer verification interface
- [x] Add QR code generation utility
- [x] Add age verification (21+)
- [x] Add credential number generator
- [x] Add privacy-preserving verification endpoint
- [ ] Add multi-region support (ready for government configuration)
- [ ] Add credential expiration handling (expiration checking implemented, renewal workflow pending)
- [ ] Add audit trail for credential issuance (verification logging implemented)

## Acceptance

1. Government officials can issue Canna ID 360™ credentials to eligible users with all required verification fields
2. Users can view their digital credential with QR code on a dedicated page
3. Retailers can scan QR code and see only "Eligible? YES/NO" without exposing sensitive personal information