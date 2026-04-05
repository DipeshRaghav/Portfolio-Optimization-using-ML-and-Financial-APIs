from portfolio.predictor import get_stock_predictions

result = get_stock_predictions()

for stock in result[:5]:
    print(stock)