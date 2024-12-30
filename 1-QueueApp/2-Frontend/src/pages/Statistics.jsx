import { useState } from 'react';
import Button from '../components/Button'

const Statistics = () => {
    const [content, setContent] = useState('');

    const handleDailyStatistics = () => {
        console.log('Daily button clicked')
        setContent('Daily button clicked')
      };

    const handleWeeklyStatistics = () => {
        console.log('Weekly button clicked')
        setContent('Weekly button clicked')
      };

    const hadleMountlylyStatistics = () => {
        console.log('Mountly button clicked')
        setContent('Mountly button clicked')
      };

    return (
        <div className="page-container box">
            <h1>Statistics</h1>
            <div className='btn-container'>
                <Button text={'Daily'} onClick={handleDailyStatistics}/>
                <Button text={'Weekly'} onClick={handleWeeklyStatistics}/>
                <Button text={'Mountly'} onClick={hadleMountlylyStatistics}/>
            </div>

            <div>
                {content && <p>{content}</p>}
            </div>
        </div>
    )
}

export default Statistics