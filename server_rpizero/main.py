import sys
import time
from datetime import datetime
import mariadb
from RFM69 import Radio, FREQ_915MHZ
from textual_plotext import PlotextPlot
import asyncio
from textual import events
from textual.app import App, ComposeResult
from textual.containers import ScrollableContainer
from textual.widgets import Button, Footer, Header, Static, Label, DataTable
from textual.reactive import reactive
from textual.message import Message
from threading import Timer


class RepeatedTimer(object):
    def __init__(self, interval, function, *args, **kwargs):
        self._timer = None
        self.interval = interval
        self.function = function
        self.args = args
        self.kwargs = kwargs
        self.is_running = False
        self.start()

    def _run(self):
        self.is_running = False
        self.start()
        self.function(*self.args, **self.kwargs)

    def start(self):
        if not self.is_running:
            self._timer = Timer(self.interval, self._run)
            self._timer.daemon = True
            self._timer.start()
            self.is_running = True

    def stop(self):
        self._timer.cancel()
        self.is_running = False


conn_params = {
    'user': "RamonHdez",
    'password': "1605",
    'host': "localhost",
    'port': 3306,
    'database': "test"
}

connection, cursor, radio = None, None, None


class SmartLabel(Label):
    def __init__(self, label_to: str, classes: str = None, id: str = None, event_enable: bool = True) -> None:
        self.label_to = label_to
        self.event_enable = event_enable
        super().__init__(id=id, classes=classes)

    label = reactive("", layout=True)

    class EndAnimation(Message):
        def __init__(self) -> None:
            super().__init__()
            self.end = True

    def on_mount(self) -> None:
        self.set_interval(1 / 35, self.update_label, repeat=1.35 * len(self.label_to))

    async def update_label(self) -> None:
        if len(self.label_to) > 0:
            self.label += self.label_to[0]
            self.label_to = self.label_to[1:]
        else:
            if self.event_enable:
                self.post_message(self.EndAnimation())
                self.event_enable = False

    def render(self) -> str:
        return self.label


# --------------------[ Setup ]--------------------
class SplashScreen(Static):
    """Display initial connections."""
    messages = [
        "Connecting to database...",
        "   ...at " + conn_params['user'] + "@" + conn_params['host'],
        "   ...with password: " + conn_params['password'],
        "   ...to DB: " + conn_params['database'],
        "Successfully connected to database!", "",
        "Initializing RFM69HCW module...",
        "   ...on main node: 1 and network: 200",
        "   ...running on 915 MHz",
        "RFM69HCW module initialized!"
    ]

    counter = reactive(-1)

    class EndSplash(Message):
        def __init__(self) -> None:
            super().__init__()
            self.end = True

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield SmartLabel(label_to="Welcome back to LoRa Server...", id="splash_1")

    def db_connect(self) -> None:
        try:
            global connection, cursor
            # Connection to the database
            connection = mariadb.connect(**conn_params)
            cursor = connection.cursor()
            cursor.execute("ALTER TABLE myTable AUTO_INCREMENT = 1")  # Reset the autoincrement
            self.mount(SmartLabel(label_to="Successfully connected to database!", id="splash_2"))

        except mariadb.Error as e:  # Error in the connection to the database
            self.mount(SmartLabel(label_to=f"Error connecting to MariaDB Platform: {e}", id="splash_2_alt",
                                  event_enable=False))

    def radio_init(self) -> None:
        try:
            global radio
            radio = Radio(FREQ_915MHZ, nodeID=2, networkID=200, isHighPower=False, verbose=False, interruptPin=18,
                          resetPin=29, spiDevice=0)
            radio.begin_receive()
            if not radio.get_packet():
                raise Exception("No connection")
            self.mount(SmartLabel(label_to="RFM69HCW module initialized!", id="splash_3"))

        except Exception as e:
            print(f"Error initializing RFM69HCW module: {e}")
            self.mount(
                SmartLabel(label_to=f"Error initializing RFM69HCW module: {e}", id="splash_2_alt", event_enable=False))

    def validate_counter(self, count: int):
        if count < len(self.messages) + 1:
            match count:
                case 1:
                    self.mount(SmartLabel(label_to=self.messages[count], event_enable=False))
                    self.mount(SmartLabel(label_to=self.messages[count + 1]))
                    self.mount(SmartLabel(label_to=self.messages[count + 2], event_enable=False))
                    return count + 3

                case 5:
                    self.db_connect()
                    return count

                case 7:
                    self.mount(SmartLabel(label_to=self.messages[count]))
                    self.mount(SmartLabel(label_to=self.messages[count + 1], event_enable=False))
                    return count + 1

                case 9:
                    self.radio_init()
                    return count

                case 10:
                    self.styles.animate("opacity", value=0.0, duration=0.75,
                                        on_complete=lambda: self.post_message(self.EndSplash()))

                case _:
                    self.mount(SmartLabel(label_to=self.messages[count]))
                    return count
        else:
            self.post_message(self.EndSplash())

    def on_smart_label_end_animation(self, event: SmartLabel.EndAnimation) -> None:
        self.counter += 1


class LoRa_Server(App):
    """A Textual app to manage stopwatches."""
    CSS_PATH = "main.tcss"
    BINDINGS = [("d", "toggle_dark", "Toggle dark mode")]
    temp = reactive([])
    table = None

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header(show_clock=True)
        yield Footer()
        yield SplashScreen(id="splash")

    def on_mount(self) -> None:
        self.title = "LoRa Server"
        self.sub_title = "Monitoring of ESP32"

    def action_toggle_dark(self) -> None:
        """An action to toggle dark mode."""
        self.dark = not self.dark

    async def on_splash_screen_end_splash(self, event: SplashScreen.EndSplash) -> None:
        await self.query("#splash").remove()

        await self.mount(ScrollableContainer(DataTable()))
        #await self.mount(ScrollableContainer(DataTable(), PlotextPlot()))
        #plt = self.query_one(PlotextPlot).plt
        self.table = self.query_one(DataTable)

        cursor.execute(f"SELECT id, temperatura FROM myTable")
        column_values = cursor.fetchall()

        if len(column_values) > 15:
            self.temp = [float(idx[1]) for idx in column_values][len(column_values) - 15:]
        else:
            self.temp = [float(idx[1]) for idx in column_values]

        self.table.add_columns(*["id", "fecha", "hora", "temperatura", "rojo", "verde", "azul"])

        rt = RepeatedTimer(0.5, self.background_task)

    #def validate_temp(self, temp: list):
    #    plotCustom(self.query_one(PlotextPlot).plt, temp)
    #    return temp

    def background_task(self):
        if radio.has_received_packet():
            packet = radio.get_packet()

            # Packet processing
            now = datetime.now()
            date_str = now.strftime("%Y-%m-%d")  # Day/Month/Year of packet reception
            time_str = now.strftime("%H:%M:%S")  # Hour:Minute:Second of packet reception
            sender_id = packet.sender  # ID of the sender
            data = packet.data_string.split("/")[0]  # Data received
            r = packet.data_string.split("/")[1].split(",")[0]
            g = packet.data_string.split("/")[1].split(",")[1]
            b = packet.data_string.split("/")[1].split(",")[2]

            self.temp = self.temp[1:] + [float(data)]

            # Insert the data into the database
            cursor.execute(
                f"INSERT INTO myTable (id_dispositivo, temperatura, fecha, hora, rojo, verde, azul) VALUES ('{sender_id}', '{data}', '{date_str}', '{time_str}', '{r}', '{g}', '{b}')")
            connection.commit()

            self.table.add_rows([(sender_id, date_str, time_str, data, r, g, b)])

            if len(self.table.rows) > 9:
                self.table.clear()


def plotCustom(plt, data):
    plt.clf()
    plt.clt()
    plt.canvas_color(233)
    plt.axes_color(235)
    plt.ticks_color(7)
    plt.title("Temperature over time")
    plt.ylim(0, 270)
    plt.plot(data, marker="braille")
    plt.show()


if __name__ == "__main__":
    app = LoRa_Server()
    app.run()
