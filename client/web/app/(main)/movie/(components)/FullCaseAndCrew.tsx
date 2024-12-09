import { Credits } from '@/utils/types';
import { getSizeOfCrew } from '@/utils/util-functions/detail-page';
import CastAndCrewImage from './CastAndCrewImage';

interface FullCaseAndCrewProps {
  credits: Credits;
}

const FullCaseAndCrew: React.FC<FullCaseAndCrewProps> = ({ credits }) => {
  return (
    <div className="flex gap-6 container">
      <div className="w-1/2 flex flex-col ml-20 gap-5">
        <div className="text-2xl font-bold">
          Cast <span className="font-normal text-gray-500">{credits.cast.length}</span>
        </div>
        {credits.cast.map((actor, index) => (
          <div key={index} className="flex flex-row items-center gap-4">
            <CastAndCrewImage image={actor.profile_path} name={actor.name} />
            <div>
              <h3 className="text-sm font-bold line-clamp-2 hover:text-primary hover:cursor-pointer">{actor.name}</h3>
              <p className="text-sm italic mt-1">{actor.character}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/2 flex flex-col ml-20 gap-5">
        <div className="text-2xl font-bold">
          Crew <span className="font-normal text-gray-500">{getSizeOfCrew(credits.crew)}</span>
        </div>
        {Object.entries(credits.crew).map(([department, crewMembers]) => (
          <div key={department} className="mb-6">
            <h2 className="text-lg font-bold mb-2">
              {department} <span className="font-normal text-gray-500">{crewMembers.length}</span>
            </h2>
            <div className="flex flex-col gap-4">
              {crewMembers.map((member, index) => (
                <div key={index} className="flex flex-row items-center gap-4">
                  <CastAndCrewImage image={member.profile_path} name={member.name} />
                  <div>
                    <h3 className="text-sm font-bold hover:text-primary hover:cursor-pointer">{member.name}</h3>
                    <p className="text-sm italic mt-1">{member.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullCaseAndCrew;
