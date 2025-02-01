function Avatar({ isSpeaking }) {
    return (
        <div data-name="avatar-wrapper" className="avatar-container">
            <div 
                data-name="avatar-image"
                className={`avatar-image w-full h-full ${isSpeaking ? 'avatar-speaking' : ''}`}
            >
                <img 
                    src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
