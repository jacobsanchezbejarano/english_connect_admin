import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function GenericOptions({ options, itemId, confirmToDelete }) {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (option) => {
    setShowOptions(false);
    if (option.label === 'Delete' && confirmToDelete) {
      confirmToDelete(itemId);
    } else if (option.route) {
      navigate(option.route.replace(':id', itemId));
    }
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