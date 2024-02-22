import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './assets/sass/style.scss'
import swapIcon from './assets/img/swap-icon.svg'

function App() {

  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState('');
  const amountToConvert = useRef('')
  const amountFromCountry = useRef('')
  const amountToCountry = useRef('')
  const [supportedCodes, setSupportedCodes] = useState([])

  const getSupportedCodes = useMemo(async () => {
    const response = await fetch('https://v6.exchangerate-api.com/v6/c76cde57f89869244b9e487f/codes');
    const data = await response.json();
    setSupportedCodes(data.supported_codes)
  }, [])


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const response = await fetch(`https://v6.exchangerate-api.com/v6/c76cde57f89869244b9e487f/pair/${fromCurrency}/${toCurrency}`);
    const data = await response.json();

    if (data.result === 'error') {
      setResult('Error: Invalid currency pair');
    } else {
      setResult(data.conversion_rate * amount);
    }
    amountToConvert.current = amount;
    amountFromCountry.current = fromCurrency;
    amountToCountry.current = toCurrency;
  }, [amount, fromCurrency, toCurrency])

  const swapValues = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  return (
    <div className='wrapper'>
      <h1>Currency Converter</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-fields-container">
          <div className="form-grp">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              id='amount'
            />
          </div>
          <div className="form-grp">
            <label htmlFor="from">From</label>
            <select id='from' value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {supportedCodes.map((code, index)=> (
                <option key={index+1} value={code[0]}>{code[0]}</option>
              ))}
            </select>
          </div>
          <div className="form-grp swap-btn-grp">
            <button className='swap-btn' type='button' onClick={swapValues}><img src={swapIcon} alt="swap icon" /></button>
          </div>
          <div className="form-grp">
            <label htmlFor="to">To</label>
            <select id='to' value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {supportedCodes.map((code, index)=> (
                <option key={index+1} value={code[0]}>{code[0]}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit">Convert</button>
      </form>
      <p className='converted-amount'><b>Converted Amount</b></p>
      {result && <p className='result-amount'>{amountToConvert.current} {amountFromCountry.current} = {result} {amountToCountry.current}</p>}
    </div>
  )
}

export default App
