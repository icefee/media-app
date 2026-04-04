interface MusicPlayingProps {
    animating?: boolean;
    fontSize?: string;
}

function MusicPlaying({ animating = false, fontSize = '18px' }: MusicPlayingProps) {

    const bars = [
        .2,
        -.4,
        -.2,
        -.5
    ];

    return (
        <div
            style={{
                width: '1em',
                height: '1em',
                aspectRatio: '1 / 1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize,
                '--bar-width': '15%'
            }}
        >
            <style type="text/css">
                {
                    `@keyframes scale-y {
                        from {
                            height: 20%;
                        }
                        to {
                            height: 100%;
                        }
                    }`
                }
            </style>
            {
                bars.map(
                    (delay, index) => (
                        <div
                            style={{
                                width: 'var(--bar-width)',
                                height: '100%',
                                borderRadius: '2px',
                                backgroundImage: 'linear-gradient(to bottom, #a78bfa, #03a9f4)',
                                animation: `.4s linear ${delay}s infinite alternate none scale-y`,
                                animationPlayState: animating ? 'running' : 'paused'
                            }}
                            key={index}
                        />
                    )
                )
            }
        </div>
    )
}

export default MusicPlaying