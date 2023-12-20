interface MusicPlayProps {
    animating?: boolean;
    fontSize?: string;
}

function MusicPlay({ animating = false, fontSize = '18px' }: MusicPlayProps) {

    const bars = [
        .2,
        -.4,
        -.2,
        -.5
    ];

    return (
        <div style={{
            width: '1em',
            height: '1em',
            aspectRatio: '1 / 1',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize,
            '--bar-width': '12%'
        }}>
            <style type="text/css">
                {
                    `@keyframes scale-y {
                        from {
                            transform: scaleY(0);
                        }
                        to {
                            transform: scaleY(1);
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

export default MusicPlay;