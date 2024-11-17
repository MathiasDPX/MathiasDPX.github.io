import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head';

import { Github, Mail, Clock } from 'lucide-react'
import GitHubCalendar from 'react-github-calendar';
import { Tooltip as ReactTooltip } from "react-tooltip";
import "../styles/global.css";

const ProfilePage = () => {
  const theme = {
    light: ['#ffffff', '#9be9a8', '#30c463', '#30a14e', '#216e39'],
  };

  const contacts = {
    github: "MathiasDPX",
    mail: "mathias@mathiasd.fr"
  }

  const getFranceTime = () => {
    const now = new Date();
    const franceTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
    return franceTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false,
      timeZone: 'Europe/Paris'
    });
  };

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch the projects from the API
    fetch(`https://raw.githubusercontent.com/${contacts['github']}/${contacts['github']}/main/projects.json`)
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const title = "Mathias's Portfolio";
  const description = "<MISSING STRING TABLE ENTRY>";
  const imageUrl = `https://raw.githubusercontent.com/${contacts['github']}/${contacts['github']}/main/assets/banner.png`
  const url = 'https://www.mathiasd.fr/';

  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>{title}</title>
        <link rel="icon" href={`https://raw.githubusercontent.com/${contacts['github']}/${contacts['github']}/main/assets/favicon.png`} type="image/png" />

        <meta name="description" content={description} />
        <meta name="keywords" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta charset="UTF-8" />

      </Head>

      <div className="grid grid-cols-1 gap-6">
        { /* Profile */ }
        <div className="bg-gray-300 p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
              <Image
                src={`https://github.com/${contacts['github']}.png`}
                alt="Profile"
                width={160}
                height={160}
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-2">Mathias DPX</h2>
              <p className="text-black mb-4 font">MISSING STRING TABLE ENTRY</p>
              <div className="flex space-x-4 mb-4">
                <Link href={`https://github.com/${contacts['github']}`} title={contacts['github']} className="text-gray-600 hover:text-gray-900">
                  <Github size={24} data-tooltip-id="gh-tooltip" data-tooltip-place="top"/>
                  <ReactTooltip id="gh-tooltip" content={`@${contacts['github']}`} />
                </Link>
                <Link href={`mailto:${contacts['mail']}`} className="text-gray-600 hover:text-gray-900" title={contacts['mail']}>
                  <Mail size={24} data-tooltip-id="mail-tooltip" data-tooltip-place="top"/>
                  <ReactTooltip id="mail-tooltip" content={contacts['mail']} />
                </Link>
              </div>
              <div className="flex space-x-1 text-gray-600 hover:text-gray-900">
                <Clock size={24} /><p data-tooltip-id="time-tooltip">{getFranceTime()}</p>
                <ReactTooltip id="time-tooltip" content="Current time in France"/>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Calendar */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
        <div className="flex justify-center">
          <GitHubCalendar
            username={contacts['github']}
            theme={theme}
            colorScheme='light'
            weekStart={1}
            eventHandlers={{
              onClick: (event) => (activity) =>{
                if (activity.date) {
                  window.open(`https://github.com/${contacts['github']}?tab=overview&from=${activity.date}&to=${activity.date}#year-list-container`);
                }
            }}}
            renderBlock={(block, activity) =>
              React.cloneElement(block, {
                'data-tooltip-id': 'react-tooltip',
                'data-tooltip-html': `${activity.count} activities on ${activity.date}<br\>Click to see`,
              })
            }
          />
        </div>
        <ReactTooltip id="react-tooltip" />
        </div>
        <div></div>
        {/* Projects */}
        {projects.map((project, index) => (
          <div 
            key={index} 
            className={`bg-gray-100 p-6 rounded-lg shadow-md flex flex-col ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } items-start`}
          >
            <div className={`flex-shrink-0 ${index % 2 === 0 ? 'md:mr-6' : 'md:ml-6'} mb-4 md:mb-0`}>
              <Image
                src={project.picture}
                alt={project.title}
                width={256}
                height={256}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-start flex-grow">
              <h2 className="text-3xl mb-2">{project.title}</h2>
              <p className="text-xl text-gray-700" dangerouslySetInnerHTML={{ __html: project.description }}></p>
              <p className="text-base text-blue-500 mt-2">
                <Link href={project.URL} className="underline">
                  {project.url_name || 'Link'}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfilePage
