import '../styles/schedule.scss';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ScheduleEntryForm from './Modal/ScheduleEntryForm';
import { useParams } from 'react-router-dom';
import api from '../api/interceptor';

const ScheduleGroup = () => {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const timeSlots = [
        '8:30 - 10:00',
        '10:10 - 11:40',
        '11:50 - 13:20',
        '14:30 - 16:00',
        '16:10 - 17:40'
    ];
    const { idgroupe } = useParams();
    const [entries, setEntries] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    
    const isSlotOccupied = (day, timeSlot) => {
        return entries.some(entry => 
            entry.slotKeys && entry.slotKeys.includes(day + timeSlot)
        );
    };
    
    const getSlotEntry = (day, timeSlot) => {
        return entries.find(entry => 
            entry.slotKeys && entry.slotKeys.includes(day + timeSlot)
        );
    };
    
    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setOpen(true);
    };
    
    const handleDelete = async (entryId) => {
        try {
            await api.delete(`/sched/api/schedule/schedule-entries/${entryId}`);
            setEntries(prev => prev.filter(entry => entry.id !== entryId));
            message.success('Schedule entry deleted successfully');
        } catch (error) {
            console.error('Error deleting entry:', error);
            message.error('Failed to delete schedule entry');
        }
    };

    useEffect(() => {
        loadEntries();
    }, [idgroupe,open]);

    const loadEntries = async () => {
        try {
            const response = await api.get(`/sched/api/schedule/schedule-entries-groupe/${idgroupe}`);
            console.log(response.data.data);
            const formattedEntries = response.data.data.map(entry => ({
                ...entry,
                slotKeys: [entry.day + entry.time_slot],
                colSpan: 1,
                subjectName: entry.name_subject,
                teacherName: entry.name,
                classRoom: entry.code_classroom
            }));
            setEntries(formattedEntries);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    return (
        <>
            <ScheduleEntryForm 
                open={open}
                setOpen={setOpen}
                setEntries={setEntries}
                days={days}
                timeSlots={timeSlots}
                entries={entries}
                editingEntry={editingEntry}
                setEditingEntry={setEditingEntry}
                groupeId={idgroupe}
            />
            <div className='row'>
                <p><strong>{entries[0]?.code_groupe} &nbsp; </strong> Schedule</p>
                <Button className="btn-entry" type="primary" onClick={() => setOpen(true)}>
                    Add Schedule Entry
                </Button>
            </div>
            <div className="parent">
                <div />
                {days.map(d => <div key={d} className="days">{d}</div>)}
                {timeSlots.map(t => (
                    <React.Fragment key={t}>
                        <div className="time">{t}</div>
                        {days.map(d => {
                            const slotId = d + t;
                            const entry = getSlotEntry(d, t);
                            
                            return (
                                <div 
                                    key={slotId} 
                                    id={slotId} 
                                    className="slot"
                                >
                                    {entry && (
                                        <span className="entry">
                                            {slotId === "1763816595765.596214:30 - 16:00" && <span className='session-now'>NOW</span>}
                                            <span className="entry-content">
                                                <span className="subject">{entry.subjectName}</span>
                                                <span className="teacher">{entry.teacherName}</span>
                                                <span className="classroom">{entry.classRoom}</span>
                                            </span>
                                            <span className="entry-actions">
                                                <Button 
                                                    type="text" 
                                                    icon={<EditOutlined />} 
                                                    size="small"
                                                    className="edit-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(entry);
                                                    }}
                                                />
                                                <Button 
                                                    type="text" 
                                                    icon={<DeleteOutlined />} 
                                                    size="small"
                                                    className="delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(entry.id);
                                                    }}
                                                />
                                            </span>
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

export default ScheduleGroup;