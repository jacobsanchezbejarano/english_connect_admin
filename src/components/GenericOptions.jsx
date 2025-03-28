import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function GenericOptions({ options, itemId }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    navigate(option.route.replace(':id', itemId));
    setShowOptions(false);
  };

  return (
    <>
      <div className={"dropdown"}>
        <button onClick={toggleOptions} className={"dropdownButton"}>
        <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        {showOptions && (
          <div className={"dropdownContent"}>
            {options.map((option) => (
              <Link
                key={option.label}
                href={option.route}
                className="dropdownItem"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default GenericOptions;