import React from 'react';
import { Card, Avatar, Button } from '@mui/material';

interface Props {
    advisor: string;
    advisorEmail: string;
    profileImg: string;
}

function AdvisorCard(props: Props) {
    return (
        <Card style={{ maxWidth: 300, padding: '10px 20px', backgroundColor: '#f0f0f0' }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid black', textAlign: 'center', paddingBottom: 10 }}>Advisor</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ paddingTop: 10 }}> {/* Add padding here */}
                    <Avatar alt={props.advisor} src={props.profileImg} sx={{ width: 100, height: 100 }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h4>{props.advisor}</h4>
                    <p>{props.advisorEmail}</p>
                    <div style={{ borderTop: '1px solid black', paddingTop: '15px', display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" href="/schedule-meeting" style={{ flex: 1 }}> {/* Use flex property */}
                            Schedule a Meeting
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default AdvisorCard;
