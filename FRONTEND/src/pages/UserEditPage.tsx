import UserEdit from '../components/UserEdit';
import GreenBG from '../components/GreenBG';
import CatBar from '../components/CatBar';

const UserEditPage = () =>
{
    return(
        <div>
            <GreenBG>
            <CatBar />
                <div className="flex items-center justify-center min-h-screen pt-24">
                     <UserEdit />
                </div>
            </GreenBG>
        </div>
    );
}

export default UserEditPage;