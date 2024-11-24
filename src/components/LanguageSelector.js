import React from 'react';

const LanguageSelector = ({ onLanguageChange }) => {
  const languages = [
    { name: 'JavaScript', mode: 'javascript' },
    { name: 'Python', mode: 'python' },
    { name: 'HTML', mode: 'html' },
    { name: 'C++', mode: 'cpp' },
    { name: 'Java', mode: 'java' }
  ];

  return (
    <select onChange={(e) => onLanguageChange(e.target.value)} className="btn leaveBtn">
      {languages.map((lang, index) => (
        <option key={index} value={lang.mode}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
