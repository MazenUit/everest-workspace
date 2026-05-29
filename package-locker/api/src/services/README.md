## Services: coordinates several domain pieces and changes state (busy locker, used codes).

## flow

storePackage(MEDIUM)
       │
       ▼
findSmallestAvailableLocker ──► null ──► { ok: false, NO_SUITABLE_LOCKER }
       │
       ▼ locker (e.g. M1)
createUniquePickupCode() ──► "A1B2C3"
       │
       ▼
M1.isAvailable = false
       │
       ▼
{ ok: true, lockerId: "M1", pickupCode: "A1B2C3" }