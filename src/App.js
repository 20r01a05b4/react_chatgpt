import React, { useState } from "react";
import OpenAI from 'openai';
import "./index.css";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  
  const [conversationHistory, setConversationHistory] = useState([]);
  const openai = new OpenAI({
    apiKey:process.env.apikey,
    dangerouslyAllowBrowser: true,
  });

  const fetchData = () => {
    setLoading(true);
    openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt + "\n" + conversationHistory.join("\n"), 
      temperature: 0.5,
      max_tokens: 4000,
    }).then((res) => {
      const generatedText = res.choices[0].text;
      setResponses({ ...responses, [prompt]: generatedText });
      setConversationHistory([...conversationHistory, prompt, generatedText]); 
      setLoading(false);
    }).catch((err) => {
      console.log("Error:", err);
      setResponses({ ...responses, [prompt]: "Something went wrong. Please try again." });
      setLoading(false);
    });
    setPrompt("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponses({ ...responses, [prompt]: "Generating..." });
    fetchData();
  };

  return (
    <>
      <h1  id="head">WELCOME TO NEW CHATGPT</h1>
      <div id="outer">
        {Object.entries(responses).map(([prompt, response], index) => (
          <div key={index} id="answer">
            <h2>USER:</h2> <textarea className="prompt" value={prompt}></textarea>
            <h2>AI:</h2> <textarea className="response" value={response}></textarea><br></br>
          </div>
        ))}

        <form onSubmit={handleSubmit} id="form">
          <textarea
            id="prompt"
            type="text"
            value={prompt}
            placeholder="Please ask OpenAI"
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            id="generate"
            disabled={loading || prompt.length === 0}
            type="submit"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
      </div>
    </>
  );
};

export default App;
