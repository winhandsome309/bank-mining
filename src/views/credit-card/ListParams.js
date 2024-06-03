const listCreditCardParams = [
  ['distance_from_home', 'The distance from home where the transaction happened.', 'normal'],
  ['distance_from_last_transaction', 'The distance from last transaction happened.', 'normal'],
  [
    'ratio_to_median_purchase_price',
    'Ratio of purchased price transaction to median purchase price.',
    'normal',
  ],
  [
    'repeat_retailer',
    'Is the transaction happened from same retailer.',
    'select',
    ['yes', 'no'],
    [1, 0],
  ],
  ['used_chip', 'Is the transaction through chip (credit card).', 'select', ['yes', 'no'], [1, 0]],
  [
    'used_pin_number',
    'Is the transaction happened by using PIN number.',
    'select',
    ['yes', 'no'],
    [1, 0],
  ],
  ['online_order', 'Is the transaction an online order.', 'select', ['yes', 'no'], [1, 0]],
]

export default listCreditCardParams
