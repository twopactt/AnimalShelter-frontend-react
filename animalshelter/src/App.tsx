import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import AnimalsPage from './pages/AnimalsPage';
import './App.css';

const { Content } = Layout;

function App() {
  return (
		<Router>
			<Layout className='layout'>
				<Header />
				<Content style={{ padding: '0 50px', marginTop: 64 }}>
					<div className='site-layout-content'>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/animals' element={<AnimalsPage />} />
						</Routes>
					</div>
				</Content>
				<Footer />
			</Layout>
		</Router>
	);
}

export default App;