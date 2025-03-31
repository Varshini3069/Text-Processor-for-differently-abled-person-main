import { useState } from "react";
import Notes from "./Notes";
import Extracter from "./Extracter";
import Questions from "./Qustions";
import "../styles/Tabs.scss";

const Home = () => {
  const [activeTab, setActiveTab] = useState<string>("Questions");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Questions":
        return <Questions />;
      case "Notes":
        return <Notes />;
      case "Extractor":
        return <Extracter />;
      default:
        return <Questions />;
    }
  };

  return (
    <div className="tabs-container">
      <div className="tab-buttons">
        {["Questions", "Notes", "Extractor"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Home;
