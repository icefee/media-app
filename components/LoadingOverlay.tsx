import Loading from './Loading';

function LoadingOverlay() {
    return (
        <div class="absolute flex justify-center items-center inset-0 z-20" style={{
            backgroundColor: 'hsla(0, 0%, 0%, .4)'
        }}>
            <div class="flex items-center rounded p-3 space-x-2 bg-black text-white">
                <Loading />
                <span>加载中..</span>
            </div>
        </div>
    )
}

export default LoadingOverlay;
