import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import AnimalsPage from './pages/AnimalsPage';
import AnimalPage from './pages/AnimalPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
	return (
		<Router>
			<Layout className="layout">
				<Header />
				<Content className="content">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/animals" element={<AnimalsPage />} />
						<Route path="/animals/:id" element={<AnimalPage />} />
					</Routes>
				</Content>
				<Footer />
			</Layout>
		</Router>
	);
};

export default App;