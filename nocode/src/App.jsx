import { HashRouter, Routes, Route, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'

import Home from './pages/home'
import Library from './pages/library'
import Install from './pages/install'
import Resources from './pages/resources'

import LearnIndex from './pages/index'
import About from './pages/about'
import Archive from './pages/archive'
import Beginner from './pages/beginner'
import Calendar from './pages/calendar'
import Contest from './pages/contest'
import CourseAlgo from './pages/course-algo'
import CourseAlgo2 from './pages/course-algo2'
import CourseGongkao from './pages/course-gongkao'
import CoursePython from './pages/course-python'
import Courses from './pages/courses'
import Ecommerce from './pages/ecommerce'
import Exams from './pages/exams'
import Gongkao from './pages/gongkao'
import Paths from './pages/paths'
import Quiz from './pages/quiz'
import Red from './pages/red'
import Search from './pages/search'
import Skills from './pages/skills'
import Socialism from './pages/socialism'

const LEARN = {
  index: LearnIndex, about: About, archive: Archive, beginner: Beginner,
  calendar: Calendar, contest: Contest, 'course-algo': CourseAlgo,
  'course-algo2': CourseAlgo2, 'course-gongkao': CourseGongkao,
  'course-python': CoursePython, courses: Courses, ecommerce: Ecommerce,
  exams: Exams, gongkao: Gongkao, paths: Paths, quiz: Quiz, red: Red,
  search: Search, skills: Skills, socialism: Socialism,
}

function LearnPageRoute() {
  const { page } = useParams()
  const C = LEARN[page] || LearnIndex
  return <C />
}

/* 切页回顶（多入口时代每页都是新文档，单页后需手动滚回） */
function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/install" element={<Install />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/learn/:page" element={<LearnPageRoute />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}
