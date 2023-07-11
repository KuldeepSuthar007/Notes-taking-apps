import React, { useEffect, useState } from 'react'
import popstyle from './Home.module.css'
import Popup from '../../components/popup/Popup';
import Chat from '../../components/Chat/Chat';
import Chatsgroup from '../../components/Chatsgroup/Chatsgroup';
import Intro from '../../components/Intro/Intro';


function Home() {


    const [showpop, setShowpop] = useState(false);
    const [userinfo, setUserinfo] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#0047FF');
    const [text, setText] = useState('')
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isMobile, setIsMobile] = useState(false);


    const togglepopup = () => {
        setShowpop(!showpop)
    }

    const handleGroupClick = (element) => {
        setUserinfo(true)
        setSelectedGroup(element);
    };

    const handleBackClick = () => {
        setSelectedGroup(null)
        setUserinfo(false)
    }

    const handleCreateGroup = (e) => {
        e.preventDefault();
        const newGroup = {
            id: Date.now().toString(),
            groupname: name,
            profilecolor: color,
            messages: [],
        };
        setGroups([...groups, newGroup]);
        setShowpop(!showpop)
    }


    const sendMessage = (text) => {
        if (selectedGroup) {
            const newMessage = {
                id: Date.now().toString(),
                content: text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }),
            };

            const updatedGroups = groups.map((group) => {
                if (group.id === selectedGroup.id) {
                    return {
                        ...group,
                        messages: [...group.messages, newMessage],
                    };
                }
                return group;
            });
            setGroups(updatedGroups);
            setText('')
        }

    };



    useEffect(() => {
        const storegroup = localStorage.getItem('groups')
        if (storegroup) {
            setGroups(JSON.parse(storegroup))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('groups', JSON.stringify(groups))
    }, [groups])

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', checkScreenSize);
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <div className={popstyle.maincontainer}>
            {showpop && <Popup handleCreateGroup={handleCreateGroup} setName={setName} setColor={setColor} />}

            {isMobile ? (
                selectedGroup ? (<Chat text={text} setText={setText} sendMessage={sendMessage} selectedGroup={selectedGroup} groups={groups} handleBackClick={handleBackClick} />) : (<Chatsgroup togglepopup={togglepopup} groups={groups} handleGroupClick={handleGroupClick} />)
            ) : (
                <>
                    <Chatsgroup togglepopup={togglepopup} groups={groups} handleGroupClick={handleGroupClick} selectedGroup={selectedGroup} />
                    {userinfo && <Chat /> ? <Chat text={text} setText={setText} sendMessage={sendMessage} selectedGroup={selectedGroup} groups={groups} handleBackClick={handleBackClick} /> : <Intro />
                    }
                </>
            )}

        </div >
    )
}

export default Home