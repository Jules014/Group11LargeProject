import UserInfo from '../components/UserInfo';
import CatBar from '../components/CatBar';
import GreenBG from '../components/GreenBG';

const UserPage = () =>
{
    return(
        <div>
	    <GreenBG>
	    <CatBar />
	        <div className="flex items-center justify-center min-h-screen pt-24">
		     <UserInfo />
		</div>
	    </GreenBG>
        </div>
    );
}

export default UserPage;