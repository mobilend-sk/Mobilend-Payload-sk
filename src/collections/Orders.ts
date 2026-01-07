import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'paymentMethod', 'createdAt'],
  },
  timestamps: true,

  fields: [
    // =====================
    // BASIC ORDER INFO
    // =====================
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Cash on delivery', value: 'cash_on_delivery' },
        { label: 'Card', value: 'card' },
        { label: 'Loan', value: 'loan' },
      ],
    },
    {
      name: 'totalItems',
      type: 'number',
      required: true,
    },

    // =====================
    // PAYMENT
    // =====================
    {
      name: 'basePayment',
      type: 'group',
      fields: [
        {
          name: 'amountValue',
          type: 'number',
          required: true,
        },
        {
          name: 'currency',
          type: 'text',
          required: true,
          defaultValue: 'EUR',
        },
      ],
    },

    // =====================
    // USER DATA (ENCRYPTED)
    // =====================
    {
      name: 'userData',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'emailHash', type: 'text' },
        { name: 'externalApplicantId', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },

    // =====================
    // CLIENT DETAILS
    // =====================
    {
      name: 'clientDetail',
      type: 'group',
      fields: [
        { name: 'country', type: 'text' },
        { name: 'streetName', type: 'text' },
        { name: 'buildingNumber', type: 'text' },
        { name: 'townName', type: 'text' },
        { name: 'postCode', type: 'text' },
        { name: 'cardHolder', type: 'text' },
      ],
    },

    // =====================
    // ORDER ITEMS
    // =====================
    {
      name: 'order',
      type: 'group',
      fields: [
        {
          name: 'orderNo',
          type: 'text',
        },
        {
          name: 'orderItems',
          type: 'array',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
            },
            {
              name: 'totalItemPrice',
              type: 'number',
              required: true,
            },
            {
              name: 'itemDetail',
              type: 'group',
              fields: [
                {
                  name: 'itemDetailSK',
                  type: 'group',
                  fields: [
                    { name: 'itemName', type: 'text' },
                    { name: 'itemDescription', type: 'text' },
                  ],
                },
                {
                  name: 'itemDetailEN',
                  type: 'group',
                  fields: [
                    { name: 'itemName', type: 'text' },
                    { name: 'itemDescription', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // =====================
    // CREDIT / LOAN DATA
    // =====================
    {
      name: 'creditData',
      type: 'group',
      fields: [
        { name: 'preferredLoanDuration', type: 'number' },
        { name: 'variableSymbol', type: 'text' },
        { name: 'specificSymbol', type: 'text' },
        { name: 'constantSymbol', type: 'text' },
        { name: 'remittanceInformation', type: 'text' },
        { name: 'monthlyIncome', type: 'number' },
        { name: 'monthlyExpenses', type: 'number' },
        { name: 'numberOfChildren', type: 'number' },
        {
          name: 'bankResponse',
          type: 'json',
        },
      ],
    },

    // =====================
    // ORDER ACTIONS (HISTORY)
    // =====================
    {
      name: 'orderActions',
      type: 'array',
      fields: [
        {
          name: 'action',
          type: 'text',
          required: true,
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
      ],
    },

    // =====================
    // TELEGRAM
    // =====================
    {
      name: 'telegramMessageId',
      type: 'number',
    },
  ],
}
