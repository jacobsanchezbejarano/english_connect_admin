import React, { useState } from 'react';

const GroupInfo = () => {
  const [groupInfo, setGroupInfo] = useState({
    name: 'English Connect 1',
    stake: 'Stake 1',
    ward: 'Ward 1',
    start_date: '2025-04-01',
    end_date: '2025-06-30',
    schedule: 'Every Saturday, 10:00 AM - 12:00 PM',
    other_group_data: {
      teacher: 'John Doe',
      room: 'Room 101'
    }
  });

  return (
    <section className='groupInfo'>
        <div className="container group-info__container">
        <h2 className="group-info__header">Group Info</h2>
        <div className="group-info__details">
            <div>
            <strong>Name:</strong> {groupInfo.name}
            </div>
            <div>
            <strong>Stake:</strong> {groupInfo.stake}
            </div>
            <div>
            <strong>Ward:</strong> {groupInfo.ward}
            </div>
            <div>
            <strong>Start Date:</strong> {groupInfo.start_date}
            </div>
            <div>
            <strong>End Date:</strong> {groupInfo.end_date}
            </div>
            <div>
            <strong>Schedule:</strong> {groupInfo.schedule}
            </div>
            <div>
            <strong>Teacher:</strong> {groupInfo.other_group_data.teacher}
            </div>
            <div>
            <strong>Room:</strong> {groupInfo.other_group_data.room}
            </div>
        </div>
        </div>
    </section>
  );
};

export default GroupInfo;
