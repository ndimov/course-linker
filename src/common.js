import { Link } from "@material-ui/core";
import React from 'react';

// export const SERVER_URL = 'http://localhost:4990' // Use the HTTP port in development
export const SERVER_URL = 'https://server.ndimov.com:5000'

export function linkifyCode(courseCode) {
    // eslint-disable-next-line
    const [department, shortName, courseNumber] = courseCode.split(" ");
    const link = `https://acadinfo.wustl.edu/CourseListings/CourseInfo.aspx?dept=${department}&crs=${courseNumber}`;
    return <Link href={link} target="_blank" underline="always">{courseCode}</Link>
}

// This function fetches the listings from the server
// and returns them as an array of JSON objects
export async function fetchListings() {
    const response = await fetch(`${SERVER_URL}/listings`, {
        headers: {
            'Bypass-Tunnel-Reminder': 1,
        }
    }).catch((e) => {
        console.error('Error fetching listings: ' + e);
        return
    });
    const body = await response.json();
    if (response.status !== 200) {
        console.error('Error fetching listings: ' + body.error);
        return
    }
    return body;
}