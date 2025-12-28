import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedResult, setConvertedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Prevent fetching if inputs are missing or currencies are the same
    if (!amount || fromCurrency === toCurrency) {
      setConvertedResult(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
          { signal }
        );

        if (!res.ok) throw new Error("API Error");

        const data = await res.json();

        // The API returns { rates: { EUR: 0.95 } }, so we grab the value dynamically
        setConvertedResult(data.rates[toCurrency]);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.message);
          setConvertedResult(null);
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="app-container">
      <div className="card">
        <h1>Currency Converter</h1>

        <div className="form-group">
          <label>Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <div className="swap-icon">⇄</div>

          <div className="form-group">
            <label>To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>

        <div className="output-box">
          {isLoading ? (
            <p className="loading">Converting...</p>
          ) : convertedResult ? (
            <p className="result">
              <span className="symbol">{toCurrency}</span> {convertedResult}
            </p>
          ) : (
            <p className="placeholder">Enter an amount to see results</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
