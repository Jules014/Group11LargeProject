import PasswordEdit from '../components/PasswordEdit';
import CatBar from '../components/CatBar';
import GreenBG from '../components/GreenBG';

const PasswordEditPage = () =>
{
    return(
        <div>
            <GreenBG>
            <CatBar />
                <div className="flex items-center justify-center min-h-screen pt-24">
                     <PasswordEdit />
                </div>
            </GreenBG>
        </div>
    );
}

export default PasswordEditPage;