import './App.css';
import React, { useEffect } from 'react';
import CurrencyRow from './CurrencyRow';

const myHeaders = new Headers();
myHeaders.append("apikey", "");

let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};


function App() {
  const [currencyOptions, setCurrencyOpotion] = React.useState([])
  const [fromCurrency, setFromCurrency] = React.useState()
  const [toCurrency, setToCurrency] = React.useState()
  const [exchangeRate, setExchangeRate] = React.useState()
  const [amount, setAmount] = React.useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = React.useState(true)

  let toAmount, fromAmount

  if(amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch("https://api.apilayer.com/exchangerates_data/latest?", requestOptions)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0]
      setCurrencyOpotion([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])


  useEffect(() => {
    if(fromCurrency != null && toCurrency != null) {
      fetch(`https://api.apilayer.com/exchangerates_data/latest?base=${fromCurrency}&symbols=${toCurrency}`, requestOptions)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  console.log(currencyOptions)

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className='equals'>=</div>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
