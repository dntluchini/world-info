import '../components-styles/btnStyles.css';

function btnShowInfo({topic, functionName, validation , className }) {
  return (
    <button className = {className} onClick={functionName}> 
      <span>
        {validation ? `Hide ${topic}`: `Show ${topic}`}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-down">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          {validation ? <path d="M6 11l6 -6" /> : <path d="M6 13l6 6" />}
          {validation ? <path d="M18 11l-6 -6" /> : <path d="M18 13l-6 6" />} 
          <path d="M12 5l0 14" />
        </svg>
      </span>
    </button>
  );
}

export default btnShowInfo;
