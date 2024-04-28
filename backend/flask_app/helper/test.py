from worker import CreditCardWorker, LoanWorker, ModelInfo, MarketingWorker
class TestData():
   loan = [{
        "id": "b2532f84ba5c7dc72dc968d5e039919e9da690c9bd6b145ddcc5d5f2263f49f8",
         "created": "Sat, 06 Apr 2024 01:19:39 GMT",
         "credit_policy": 1,
         "days_with_cr_line": 5368.958333,
         "delinq_2yrs": 0,
         "dti": 13.5,
         "fico": 712,
         "inq_last_6mths": 3,
         "installment": 507.46,
         "int_rate": 0.1122,
         "log_annual_inc": 10.59663473,
         "pub_rec": 1,
         "purpose": "debt_consolidation",
         "revol_bal": 6513,
         "revol_util": 34.3,
   }]
    
   marketing = [
      {
         'age': 59,
         'job': 'admin.',
         'marital': 'married',
         'education': 'secondary',
         'default': 'no',
         'balance': 2343,
         'housing': 'yes',
         'loan': 'no',
         'contact': 'unknown',
         'day': 5,
         'month': 'may',
         'duration': 1042,
         'campaign': 1,
         'pdays': -1,
         'previous': 0,
         'poutcome': 'unknown',
         'deposit': 'yes'
      },
      {
         'age': 56,
         'job': 'admin.',
         'marital': 'married',
         'education': 'secondary',
         'default': 'no',
         'balance': 45,
         'housing': 'no',
         'loan': 'no',
         'contact': 'unknown',
         'day': 5,
         'month': 'may',
         'duration': 1467,
         'campaign': 1,
         'pdays': -1,
         'previous': 0,
         'poutcome': 'unknown',
         'deposit': 'no'
      },
      {
         'age': 19,
         'job': 'technician',
         'marital': 'married',
         'education': 'secondary',
         'default': 'no',
         'balance': 1000,
         'housing': 'yes',
         'loan': 'no',
         'contact': 'unknown',
         'day': 1,
         'month': 'may',
         'duration': 139,
         'campaign': 1,
         'pdays': -1,
         'previous': 0,
         'poutcome': 'unknown',
         'deposit': 'yes'
      }
   ]


   credit_card = [
    {
        'distance_from_home': 57.87785658389723,
        'distance_from_last_transaction': 0.3111400080477545,
        'ratio_to_median_purchase_price': 1.9459399775518593,
        'repeat_retailer': 1.0,
        'used_chip': 1.0,
        'used_pin_number': 0.0,
        'online_order': 0.0,
    },
    {
        'distance_from_home': 10.829942699255545,
        'distance_from_last_transaction': 0.17559150228166587,
        'ratio_to_median_purchase_price': 1.2942188106198573,
        'repeat_retailer': 1.0,
        'used_chip': 0.0,
        'used_pin_number': 0.0,
        'online_order': 0.0,
    },
    {
        'distance_from_home': 5.091079490616996,
        'distance_from_last_transaction': 0.8051525945853258,
        'ratio_to_median_purchase_price': 0.42771456119427587,
        'repeat_retailer': 1.0,
        'used_chip': 0.0,
        'used_pin_number': 0.0,
        'online_order': 1.0,
    }
   ]
if __name__ == '__main__':
   model_info = ModelInfo.create('Credit Fraud Detection')
   worker = CreditCardWorker(model_info)
   test_data = TestData()
   for idx, test in enumerate(test_data.credit_card):
      print(f">> RESULT #{idx + 1}: ")
      print(worker.predict(test))