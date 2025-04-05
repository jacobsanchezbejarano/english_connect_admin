import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GenericOptions from '../components/GenericOptions';

const stakeInformationData = [
  { id: 1, name: "Ikot Akpaden ward", location: "Nigeria", stakeNumber: "12345" },
  { id: 2, name: "Ikot Isighe ward", location: "Nigeria", stakeNumber: "12555" },
  { id: 3, name: "Mkpat Enin ward", location: "Nigeria", stakeNumber: "00345" },
  { id: 4, name: "Ibotio Branch", location: "Nigeria", stakeNumber: "86745" },
  { id: 5, name: "Ikot Ekpenyong Branch", location: "Nigeria", stakeNumber: "13335" },
  { id: 6, name: "Ikot Ekong ward", location: "Nigeria", stakeNumber: "00045" },
  { id: 7, name: "Ndiko Ward", location: "Nigeria", stakeNumber: "19085" },
  { id: 8, name: "Ette Branch", location: "Nigeria", stakeNumber: "11145" },
  { id: 9, name: "Ikot Akpaden Nigeria Stake", location: "Nigeria", stakeNumber: "12634" },
];

const options = [
  {
    label: 'Edit',
    route: '/stakeInfo/:id',
  },
  {
    label: 'Delete',
    route: '/delete/:id',
  },
];

const StakeInformation = ({ stake }) => {
  const selectedStake = stakeInformationData.find(u => u.name === stake);

  return (
    <section className='unit__information'>
      <h2 className='unit-information__header'>Stake Information</h2>
      <div className='unit-information__container'>
        {selectedStake ? (
          <Link to={`/stakes`} className='unit__info'>
            <GenericOptions options={options} itemId={selectedStake.id} />
            <div className='unit-information__details'>
              <p><strong>Stake Name:</strong> {selectedStake.name}</p>
              <p><strong>Location:</strong> {selectedStake.location}</p>
              <p><strong>Stake Number:</strong> {selectedStake.unitNumber}</p>
            </div>
          </Link>
        ) : (
          <p>No stake selected.</p>
        )}
      </div>
    </section>
  );
};

export default StakeInformation;
