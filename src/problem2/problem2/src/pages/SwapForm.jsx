import { useEffect, useState } from 'react';
import '../css/style.css';

const SwapForm = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USD');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://interview.switcheo.com/prices.json')
      .then((res) => res.json())
      .then((data) => {
        const priceData = {};
        const tokenList = [];

        data.forEach((item) => {
          priceData[item.currency] = item.price;
          tokenList.push(item.currency);
        });

        setPrices(priceData);
        setTokens(tokenList);
      })
      .catch((error) => console.error('Error fetching token data:', error));
  }, []);

  useEffect(() => {
    if (amount && prices[fromToken] && prices[toToken]) {
      const fromPrice = prices[fromToken];
      const toPrice = prices[toToken];
      setConvertedAmount(((amount * fromPrice) / toPrice).toFixed(3));
    }
  }, [amount, fromToken, toToken, prices]);

  const handleSwap = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Swapped ${amount} ${fromToken} to ${convertedAmount} ${toToken}!`);
    }, 2000);
  };

  const handleReverseSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount(convertedAmount);
  };

  return (
    <div className="swap-form-container">
      <h2>Swap Tokens</h2>

      <div className="swap-input-container">
        <select
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          className="swap-token-select"
        >
          {tokens.map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="amount-input"
        />
      </div>

      <button type="button" onClick={handleReverseSwap} className="swap-button">
        ↔️
      </button>

      <div className="swap-input-container">
        <select
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          className="swap-token-select"
        >
          {tokens.map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={convertedAmount}
          className="converted-amount"
          readOnly
        />
      </div>

      <button
        onClick={handleSwap}
        disabled={loading}
        className="confirm-swap-btn"
      >
        {loading ? 'Swapping...' : 'Confirm Swap'}
      </button>
    </div>
  );
};

export default SwapForm;
