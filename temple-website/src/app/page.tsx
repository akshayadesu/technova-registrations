import Calendar from '../components/Calendar';

const Home = () => {
  const templeId = 1; // Example temple ID

  return (
    <div>
      <h1>Temple Calendar</h1>
      <Calendar templeId={templeId} />
    </div>
  );
};

export default Home;