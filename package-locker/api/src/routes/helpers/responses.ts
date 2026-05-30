import { Response } from 'express';

// Send a 400 Bad Request response when the package size is invalid
export function sendBadSize(res: Response): void {
  res.status(400).json({
    message: 'packageSize must be SMALL, MEDIUM, or LARGE',
  });
}

// Send a 409 Conflict response when no suitable locker is available
export function sendNoLocker(res: Response, reason: string): void {
  res.status(409).json({
    message: 'No suitable locker available for this package',
    reason,
  });
}

// Send a 201 Created response when the package is stored successfully
export function sendStored(res: Response, lockerId: string, pickupCode: string): void {
  res.status(201).json({
    lockerId,
    pickupCode,
    message: 'Package stored successfully',
  });
}

// Send a 400 Bad Request response when the pickup code is missing
export function sendMissingPickupCode(res: Response): void {
  res.status(400).json({
    message: 'pickupCode is required',
  });
}
export function sendRetrieveNotFound(res: Response, reason: string): void {
  res.status(404).json({
    message: 'Cannot retrieve package',
    reason,
  });
}

// Send a 403 Forbidden response when the pickup code is invalid
export function sendInvalidPickup(res: Response): void {
  res.status(403).json({
    message: 'Invalid pickup code for this locker',
    reason: 'INVALID_PICKUP',
  });
}

// Send a 200 OK response when the package is retrieved successfully 
// and the storage charge is returned
export function sendRetrieved(res: Response, lockerId: string, storageCharge: number): void {
  res.status(200).json({ lockerId, storageCharge, message: 'Package retrieved successfully' });
}

