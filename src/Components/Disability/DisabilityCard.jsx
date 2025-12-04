import mobility from "../../assets/Mobility.jpg";
import hearing from "../../assets/hearing.jpg";
import visual from "../../assets/visual.jpg";
import intellectual from "../../assets/intellectual.jpg";
import Psychological from "../../assets/Psychological.jpg";
import speech from "../../assets/speech.jpg";

const DisabilityCard = ({ disability, onSelect, isSelected }) => {
  const images = {
    "Mobility Disability": mobility,
    "Visual Disability": visual,
    "Hearing Disability": hearing,
    "Intellectual Disability": intellectual,
    "Psychological Disability": Psychological,
    "Speech and Communication Disability": speech,
  };

  return (
    <div
      className={`border rounded-lg p-4 m-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-300"
      }`}
      onClick={() => onSelect(disability._id)}
    >
      <img
        src={
          images[disability.name] ||
          "https://images.unsplash.com/photo-1530103043960-d1a412999e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
        }
        alt={disability.name}
        className="w-full h-80 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">{disability.name}</h3>
      <p className="text-gray-600">{disability.description}</p>
      <div className="mt-2">
        <h4 className="text-sm font-medium">Assistive Tools:</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          {disability.assistive_tools.map((tool) => (
            <li key={tool._id}>
              {tool.name}: {tool.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <h4 className="text-sm font-medium">Interaction Guidelines:</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          {disability.interaction_guidelines.map((guideline, index) => (
            <li key={index}>{guideline}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DisabilityCard;
