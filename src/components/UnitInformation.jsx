import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GenericOptions from '../components/GenericOptions';

const unitInformationData = [
  { id: 1, name: "Ikot Akpaden ward", location: "Nigeria", unitNumber: "12345" },
  { id: 2, name: "Ikot Isighe ward", location: "Nigeria", unitNumber: "12555" },
  { id: 3, name: "Mkpat Enin ward", location: "Nigeria", unitNumber: "00345" },
  { id: 4, name: "Ibotio Branch", location: "Nigeria", unitNumber: "86745" },
  { id: 5, name: "Ikot Ekpenyong Branch", location: "Nigeria", unitNumber: "13335" },
  { id: 6, name: "Ikot Ekong ward", location: "Nigeria", unitNumber: "00045" },
  { id: 7, name: "Ndiko Ward", location: "Nigeria", unitNumber: "19085" },
  { id: 8, name: "Ette Branch", location: "Nigeria", unitNumber: "11145" },
  { id: 9, name: "Ikot Akpaden Nigeria Stake", location: "Nigeria", unitNumber: "12634" },
];

const options = [
  {
    label: 'Edit',
    route: '/unitInfo/:id',
  },
  {
    label: 'Delete',
    route: '/delete/:id',
  },
];

const UnitInformation = ({ unit }) => {
  const selectedUnit = unitInformationData.find(u => u.name === unit);

  return (
    <section className='unit__information'>
      <h2 className='unit-information__header'>Unit Information</h2>
      <div className='unit-information__container'>
        {selectedUnit ? (
          <Link to={`/units`} className='unit__info'>
            <GenericOptions options={options} itemId={selectedUnit.id} />
            <div className='unit-information__details'>
              <p><strong>Unit Name:</strong> {selectedUnit.name}</p>
              <p><strong>Location:</strong> {selectedUnit.location}</p>
              <p><strong>Unit Number:</strong> {selectedUnit.unitNumber}</p>
            </div>
          </Link>
        ) : (
          <p>No unit selected.</p>
        )}
      </div>
    </section>
  );
};

export default UnitInformation;
