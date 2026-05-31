## Services

`LockerStation` — list, store, retrieve. Calls repos + domain rules (allocator, pickup code, charge).

## Store flow

```
storePackage(size)
  → withTransaction
  → listLockersForUpdate + findSmallestAvailableLocker
  → markUnavailable + insert assignment
  → COMMIT
```

## Retrieve flow

```
retrievePackage(lockerId, code)
  → lockerExists (404 if missing)
  → withTransaction
  → findActiveForLocker + validate code
  → calculateStorageCharge + markRetrieved + markAvailable
```
