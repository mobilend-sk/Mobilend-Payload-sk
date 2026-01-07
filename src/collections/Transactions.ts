import { CollectionConfig } from 'payload'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'paymentId',
    defaultColumns: ['orderNumber', 'status', 'authorizationStatus', 'createdAt'],
  },
  timestamps: true,

  fields: [
    // =====================
    // PAYMENT IDENTIFIERS
    // =====================
    {
      name: 'paymentId',
      type: 'text',
      unique: true,
    },

    // =====================
    // REQUEST DATA
    // =====================
    {
      name: 'requestData',
      type: 'group',
      fields: [
        {
          name: 'userData',
          type: 'group',
          fields: [
            { name: 'firstName', type: 'text' },
            { name: 'lastName', type: 'text' },
            { name: 'email', type: 'text' },
            { name: 'externalApplicantId', type: 'text' },
            { name: 'phone', type: 'text' },
          ],
        },
        {
          name: 'payLater',
          type: 'group',
          fields: [
            {
              name: 'order',
              type: 'group',
              fields: [
                {
                  name: 'orderItems',
                  type: 'array',
                  fields: [
                    { name: 'itemId', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // =====================
    // STATUS
    // =====================
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'initiated',
      options: [
        { label: 'Initiated', value: 'initiated' },
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'authorizationStatus',
      type: 'text',
    },

    // =====================
    // STATUS HISTORY
    // =====================
    {
      name: 'statusHistory',
      type: 'array',
      fields: [
        {
          name: 'status',
          type: 'text',
          required: true,
        },
        {
          name: 'authorizationStatus',
          type: 'text',
        },
        {
          name: 'message',
          type: 'text',
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
        {
          name: 'rawData',
          type: 'json',
        },
      ],
    },

    // =====================
    // METADATA
    // =====================
    {
      name: 'metadata',
      type: 'group',
      fields: [
        { name: 'currency', type: 'text' },
        { name: 'paymentMethod', type: 'text' },
        { name: 'customerEmail', type: 'text' },
        { name: 'customerPhone', type: 'text' },
        { name: 'ipAddress', type: 'text' },
        { name: 'userAgent', type: 'text' },
      ],
    },

    // =====================
    // TRANSACTION TIMESTAMPS
    // =====================
    {
      name: 'transactionTimestamps',
      type: 'group',
      fields: [
        { name: 'initiated', type: 'date' },
        { name: 'redirected', type: 'date' },
        { name: 'completed', type: 'date' },
      ],
    },

    // =====================
    // STATUS CHECKING
    // =====================
    {
      name: 'statusCheckAttempts',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastStatusCheck',
      type: 'date',
    },

    // =====================
    // RESPONSE DATA
    // =====================
    {
      name: 'responseData',
      type: 'json',
    },
  ],
}
