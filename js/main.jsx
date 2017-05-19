class App extends React.Component {
    render() {
        return <WordLadderGame/>;
    }
}

const GameStatesEnum = {
    UNSTARTED: 1,
    PLAYING: 2,
    WON: 3,
    LOST: 4
}

class WordLadderGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guess: '',
            items: [],
            gameState: GameStatesEnum.UNSTARTED
        };

        this._beginGame = this._beginGame.bind(this);
        this._gameLost = this._gameLost.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount() {
        // These would normally be loaded from an ajax call here, but that is out of the scope of this assignment
        this.setState({
            items: [
                {
                    word: 'Cat',
                    clue: 'Feline',
                    guessed: false
                }, {
                    word: 'Hat',
                    clue: 'You put it on your head',
                    guessed: false
                }, {
                    word: 'Mat',
                    clue: 'Wipe your feet on it',
                    guessed: false
                }, {
                    word: 'Map',
                    clue: 'What cartographers make',
                    guessed: false
                }, {
                    word: 'Mop',
                    clue: 'Use it to clean a sticky floor',
                    guessed: false
                }, {
                    word: 'Hop',
                    clue: 'Jump',
                    guessed: false
                }, {
                    word: 'Hot',
                    clue: 'Not cold',
                    guessed: false
                }, {
                    word: 'Pot',
                    clue: 'Where to plant a flower',
                    guessed: false
                }, {
                    word: 'Pit',
                    clue: 'Seed of a fruit',
                    guessed: false
                }
            ]
        });
    }

    _beginGame() {
        this.setState({gameState: GameStatesEnum.PLAYING});
    }

    _gameWon() {
        this.setState({gameState: GameStatesEnum.WON});
    }

    _gameLost() {
        this.setState({gameState: GameStatesEnum.LOST});
    }

    _handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    _handleSubmit(event) {
        const guessIndex = this.state.items.findIndex((item) => item.word.toLowerCase() === this.state.guess.toLowerCase());
        if (guessIndex !== -1) { // correct guess
            var newItems = this.state.items;
            newItems[guessIndex].guessed = true;
            this.setState({guess: '', items: newItems});
            if (this.state.items.every((item) => item.guessed)) {
                this._gameWon();
            }
        }
        event.preventDefault();
    }

    render() {
        if (this.state.gameState === GameStatesEnum.UNSTARTED) {
            return (
                <div id='WordLadderGame' className='text-center'>
                    <StartScreen onStartClicked={this._beginGame}/>
                </div>
            );
        }
        var topBar;
        if (this.state.gameState === GameStatesEnum.PLAYING) {
            topBar = (
                <form onSubmit={this._handleSubmit}>
                    <label>
                        <input name='guess' placeholder='Guess' value={this.state.guess} onChange={this._handleInputChange} autoComplete="off"/>
                    </label>
                    <input type='submit' value='Submit'/>
                </form>
            );
        } else if (this.state.gameState === GameStatesEnum.WON) {
            topBar = <span id="won">You Won!</span>;
        } else if (this.state.gameState === GameStatesEnum.LOST) {
            topBar = <span id="lost">You Lost!</span>;
        }
        return (
            <div id='WordLadderGame' className='text-center'>
                <div id="topBar">
                    {topBar}
                    <Timer startSeconds={60} gameState={this.state.gameState} onExpiration={this._gameLost}/>
                </div>
                <Ladder items={this.state.items}/>
            </div>
        );
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsLeft: this.props.startSeconds
        };
        this._tick = this._tick.bind(this);
        this._timer = setInterval(this._tick, 1000); // 1000ms = 1 second
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.gameState === GameStatesEnum.WON || nextProps.gameState === GameStatesEnum.LOST) {
            clearInterval(this._timer);
        }
    }

    _tick() {
        this.setState({
            secondsLeft: this.state.secondsLeft - 1
        });
        if (this.state.secondsLeft <= 0) {
            this.props.onExpiration();
        }
    }

    componentWillUnmount() {
        // Remove timer to prevent leak when component is unmounted
        clearInterval(this.timer);
    }

    render() {
        return (
            <div id='timer'>
                <span id='time'>
                    {this.state.secondsLeft}
                </span>
                {' seconds left'}
            </div>
        );
    }
}

const StartScreen = (props) => {
    return (
        <button onClick={props.onStartClicked}>
            Begin Game
        </button>
    );
}

class Ladder extends React.Component {
    render() {
        const rungs = this.props.items.map((item) => {
            return <Rung key={item.word} clue={item.clue} word={item.word} guessed={item.guessed}/>
        });
        return (
            <table id='ladder' className='table table-striped'>
                <thead>
                    <tr>
                        <th>Clue</th>
                        <th>Word</th>
                    </tr>
                </thead>
                <tbody>
                    {rungs}
                </tbody>
            </table>
        );
    }
}

const Rung = (props) => {
    return (
        <tr className={props.guessed
            ? 'success'
            : ''}>
            <td>{props.clue}</td>
            <td>{props.guessed
                    ? props.word
                    : ''}</td>
        </tr>
    );
};

ReactDOM.render(
    <App/>, document.getElementById('app'));
