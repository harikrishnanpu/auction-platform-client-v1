export const SELLER_AUCTION_VALIDATION = {
  TITLE_REQUIRED: 'Title is required',
  CATEGORY_REQUIRED: 'Category is required',
  CONDITION_REQUIRED: 'Condition is required',
  START_PRICE_MIN: 'Start price must be 500 or more',
  START_TIME_REQUIRED: 'Start time is required',
  END_TIME_REQUIRED: 'End time is required',
  END_AFTER_START: 'End time must be after start time',
  SEALED_ZERO: 'Must be 0 for sealed auctions',
  MIN_INCREMENT_MIN: 'Min increment must be 1 or more',
  WHOLE_NUMBER: 'Must be a whole number',
} as const;

export const SELLER_AUCTION_MESSAGES = {
  UPLOAD_ALL_FILES: 'Please upload all selected files first.',
  WAIT_FOR_UPLOADS: 'Please wait for uploads to finish.',
  ASSET_REQUIRED: 'At least one image or video is required.',
  CREATE_FAILED: 'Failed to create auction',
  DRAFT_CREATED: 'Auction created as draft.',
  DRAFT_UPDATED: 'Draft updated.',
  DRAFT_UPDATE_FAILED: 'Failed to update draft',
  PUBLISH_FAILED: 'Failed to publish draft',
  PUBLISHED: 'Auction published.',
} as const;
