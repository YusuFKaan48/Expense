import React from 'react';
import { ScrollView } from 'react-native';
import WorkHoursTracker from '../../components/Main/Home/WorkHoursTracker';
import Activedays from '../../components/Main/Home/Activedays';
import ActiveTasks from '../../components/Main/Task/ActiveTasks';
import HomeHeader from '../../components/Main/Home/HomeHeader';

export default function Home() {
    return (
        <ScrollView className="bg-[#F3F1EF] pt-[8px] px-[32px]">
            <HomeHeader />
            <WorkHoursTracker />
            <Activedays />
            <ActiveTasks />
        </ScrollView>
    );
}
