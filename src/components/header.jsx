// Navbar.js
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const start = (
        <span className="name" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            NoteS
        </span>
    );

    const end = (
        <div className="account" style={{ display: 'flex', gap: '10px' }}>
            <Button
                label="Login"
                className=""
                onClick={() => navigate('/login')}
            />
            <Button
                label="Signup"
                className=""
                onClick={() => navigate('/signup')}
            />
        </div>
    );

    return (
        <div className="header">
            <Menubar
                start={start}
                end={end}
                className="navbar"
                model={[]} // 👈 This forces NO dropdown at all
            />
        </div>
    );
}
