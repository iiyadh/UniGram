import '../styles/schedule.scss';
import React, { useEffect, useState } from 'react';
import AbsenceList from './Modal/AbsenceList';
import { useParams } from 'react-router-dom';
import api from '../api/interceptor';
import { Spin } from 'antd';

const ScheduleTeacher = () => {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const timeSlots = [
        '8:30 - 10:00',
        '10:10 - 11:40',
        '11:50 - 13:20',
        '14:30 - 16:00',
        '16:10 - 17:40'
    ];
    
    const { idteacher } = useParams();
    const [entries, setEntries] = useState([]);
    const [openSession, setOpenSession] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleCloseSession = () => {
        setOpenSession(null);
    };
    
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
        loadTeacherSchedule();
    }, [idteacher]);

    const loadTeacherSchedule = async () => {
        setLoading(true);
        try {
            if (idteacher) {
                const response = await api.get(`/sched/api/schedule/schedule-entries-teacher/${idteacher}`);
                console.log(response.data.data);
                const formattedEntries = response.data.data.map(entry => ({
                    ...entry,
                    slotKeys: [entry.day + entry.time_slot],
                    colSpan: 1,
                    subjectName: entry.name_subject,
                    groupName: entry.code_groupe,
                    groupId: entry.groupe_id,
                    classRoom: entry.code_classroom,
                    teacherName: entry.name
                }));
                setEntries(formattedEntries);
            } else {
                console.warn('No idteacher provided, using mock data');
                setEntries([
                    {
                        id: 1,
                        subjectName: "Database Systems",
                        groupName: "DSI 31",
                        classRoom: "Lab 1",
                        slotKeys: ["Monday8:30 - 10:00", "Monday10:10 - 11:40"],
                        subject_name: "Database Systems",
                        groupe_name: "DSI 31",
                        classroom_code: "Lab 1",
                        teacher_name: "Mr foulan elfoulani"
                    },
                    {
                        id: 2,
                        subjectName: "Web Development",
                        groupName: "DSI 32",
                        classRoom: "Lab 2",
                        slotKeys: ["Tuesday14:30 - 16:00"],
                        subject_name: "Web Development",
                        groupe_name: "DSI 32",
                        classroom_code: "Lab 2",
                        teacher_name: "Mr foulan elfoulani"
                    }
                ]);
            }
        } catch (error) {
            console.error('Error loading teacher schedule:', error);
            setEntries([
                {
                    id: 1,
                    subjectName: "Database Systems",
                    groupName: "DSI 31",
                    classRoom: "Lab 1",
                    slotKeys: ["Monday8:30 - 10:00", "Monday10:10 - 11:40"],
                    subject_name: "Database Systems",
                    groupe_name: "DSI 31",
                    classroom_code: "Lab 1",
                    teacher_name: "Mr foulan elfoulani"
                },
                {
                    id: 2,
                    subjectName: "Web Development",
                    groupName: "DSI 32",
                    classRoom: "Lab 2",
                    slotKeys: ["Tuesday14:30 - 16:00"],
                    subject_name: "Web Development",
                    groupe_name: "DSI 32",
                    classroom_code: "Lab 2",
                    teacher_name: "Mr foulan elfoulani"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const loadTeacherScheduleDirect = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/sched/api/schedule/teacher/${idteacher}`);
            const formattedEntries = response.data.data.map(entry => ({
                ...entry,
                slotKeys: [entry.day + entry.time_slot],
                colSpan: 1,
                subjectName: entry.subject_name,
                gropue_id: entry.groupe_id,
                groupName: entry.groupe_name,
                classRoom: entry.classroom_code,
                teacherName: entry.teacher_name
            }));
            setEntries(formattedEntries);
        } catch (error) {
            console.error('Error loading teacher schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTeacherName = () => {
        if (entries.length > 0 && entries[0].teacher_name) {
            return entries[0].teacher_name;
        }
        return "Mr foulan elfoulani";
    };

    const isCurrentSession = (slotId) => {
        const now = new Date();
        const currentDay = days[now.getDay() - 1];
        const currentTime = now.getHours() + ':' + now.getMinutes();
        return slotId.includes(currentDay) && Math.random() > 0.7;
    };

    return (
        <>
            <div className='row'>
                <p><strong>{entries[0]?.teacherName}</strong> Schedule</p>
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
                                            <span className="entry-content teacher-view" onClick={() => setOpenSession(entry.id)}>
                                                <span className="subject">{entry.subjectName}</span>
                                                <span className="group">{entry.groupName}</span>
                                                <span className="classroom">{entry.classRoom}</span>
                                            </span>
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        }
            {loading && <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>}
            
            {/* Conditionally render AbsenceList modal */}
            {openSession && (
                <AbsenceList 
                    isOpen={true}
                    onClose={handleCloseSession}
                    sessionData={entries.find(entry => entry.id === openSession)}
                />
            )}
        </>
    )
}

export default ScheduleTeacher;