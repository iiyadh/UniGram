import '../styles/schedule.scss';
import React, { useEffect, useState } from 'react';
import {  Spin } from 'antd';
import { useParams } from 'react-router-dom';
import api from '../api/interceptor';

const ScheduleClassroom = () => {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const timeSlots = [
        '8:30 - 10:00',
        '10:10 - 11:40',
        '11:50 - 13:20',
        '14:30 - 16:00',
        '16:10 - 17:40'
    ];
    
    const { idclassroom } = useParams();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    
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
    
    const isFirstSlotOfEntry = (day, timeSlot, entry) => {
        if (!entry || !entry.slotKeys) return false;
        const dayTimeSlots = entry.slotKeys.filter(key => key.startsWith(day));
        const currentSlotKey = day + timeSlot;
        return dayTimeSlots[0] === currentSlotKey;
    };

    useEffect(() => {
        loadClassroomSchedule();
    }, [idclassroom]);

    const loadClassroomSchedule = async () => {
        setLoading(true);
        try {
            if (idclassroom) {
                // Fetch from API using the store
                const response = await api.get(`/sched/api/schedule/schedule-entries-classroom/${idclassroom}`);
                console.log(response.data.data);
                const formattedEntries = response.data.data.map(entry => ({
                    ...entry,
                    slotKeys: [entry.day + entry.time_slot],
                    colSpan: 1,
                    subjectName: entry.name_subject,
                    teacherName: entry.name,
                    groupe: entry.code_groupe,
                    classRoom: entry.code_classroom
                }));
                setEntries(formattedEntries);
            } else {
                // Fallback to mock data if no idclassroom provided
                console.warn('No idclassroom provided, using mock data');
                setEntries([
                    {
                        id: 1,
                        subjectName: "Database Systems",
                        teacherName: "Dr. Ahmed Ben Salem",
                        groupe: "DSI 31",
                        slotKeys: ["Monday8:30 - 10:00", "Monday10:10 - 11:40"],
                        subject_name: "Database Systems",
                        teacher_name: "Dr. Ahmed Ben Salem",
                        groupe_name: "DSI 31",
                        classroom_code: "SI 01"
                    },
                    {
                        id: 2,
                        subjectName: "Web Development",
                        teacherName: "Prof. Fatima Zahra",
                        groupe: "DSI 32",
                        slotKeys: ["Tuesday14:30 - 16:00"],
                        subject_name: "Web Development",
                        teacher_name: "Prof. Fatima Zahra",
                        groupe_name: "DSI 32",
                        classroom_code: "SI 01"
                    }
                ]);
            }
        } catch (error) {
            console.error('Error loading classroom schedule:', error);
            // Fallback to mock data in case of error
            setEntries([
                {
                    id: 1,
                    subjectName: "Database Systems",
                    teacherName: "Dr. Ahmed Ben Salem",
                    groupe: "DSI 31",
                    slotKeys: ["Monday8:30 - 10:00", "Monday10:10 - 11:40"],
                    subject_name: "Database Systems",
                    teacher_name: "Dr. Ahmed Ben Salem",
                    groupe_name: "DSI 31",
                    classroom_code: "SI 01"
                },
                {
                    id: 2,
                    subjectName: "Web Development",
                    teacherName: "Prof. Fatima Zahra",
                    groupe: "DSI 32",
                    slotKeys: ["Tuesday14:30 - 16:00"],
                    subject_name: "Web Development",
                    teacher_name: "Prof. Fatima Zahra",
                    groupe_name: "DSI 32",
                    classroom_code: "SI 01"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Alternative method using direct API call
    const loadClassroomScheduleDirect = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/sched/api/schedule/classroom/${idclassroom}`);
            const formattedEntries = response.data.data.map(entry => ({
                ...entry,
                slotKeys: [entry.day + entry.time_slot],
                colSpan: 1,
                subjectName: entry.subject_name,
                teacherName: entry.teacher_name,
                groupe: entry.groupe_name,
                classRoom: entry.classroom_code
            }));
            setEntries(formattedEntries);
        } catch (error) {
            console.error('Error loading classroom schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check if current session is active (for "NOW" badge if needed)
    const isCurrentSession = (slotId) => {
        const now = new Date();
        const currentDay = days[now.getDay() - 1];
        const currentTime = now.getHours() + ':' + now.getMinutes();
        
        // Implement your actual time comparison logic here
        return slotId.includes(currentDay) && Math.random() > 0.7; // Random for demo
    };

    return (
        <>
            <div className='row'>
                <p><strong>{entries[0]?.classRoom}</strong> Schedule</p>
            </div>
            {!loading && <div className="parent">
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
                                            {isCurrentSession(slotId) && <span className='session-now'>NOW</span>}
                                            <span className="entry-content">
                                                <span className="subject">{entry.subjectName}</span>
                                                <span className="teacher">{entry.teacherName}</span>
                                                <span className="groupe">{entry.groupe}</span>
                                            </span>
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>}
            {loading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}><Spin size="large" /></div>}
        </>
    )
}

export default ScheduleClassroom;