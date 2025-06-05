import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const HomePage: React.FC = () => {
	return (
		<Content className='site-layout-content'>
			<h1>Добро пожаловать в приют для животных</h1>
		</Content>
	);
};

export default HomePage;