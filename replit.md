# AI Meeting Context Summarizer + Action Mapper

## Overview
A hackathon-ready web application that takes meeting transcripts and generates summaries, action items, and a Kanban board using AI (mocked for development).

## Features
- **Transcript Input**: Paste text or upload .txt files.
- **AI Analysis**: Mock AI service returning summaries and categorized action items.
- **Dashboard**:
  - Executive Summary
  - Action Items List
  - Kanban Board (High/Medium/Low priority)

## Architecture
- **Frontend**: React, Tailwind CSS, Shadcn UI, Framer Motion.
- **Backend**: Express, Drizzle ORM, PostgreSQL.
- **AI**: Currently using a mock implementation in `server/routes.ts` for instant feedback and reliability during demos.

## Recent Changes
- Initial project scaffold.
- Implemented mock AI endpoint.
- Generated frontend dashboard.
