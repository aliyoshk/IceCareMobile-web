<template>
    <div class="transfer_details">

        <section class="header-section">
            <div class="header">
                <!-- <button class="back-button" @click="goBack">← Back</button> -->
                <button class="back-button">← Back</button>
                <h1 class="title">Customer Transfer Details</h1>
            </div>
        </section>


        <div class="general">
            <section class="details-section">
                <div class="customer-details-card">
                    <div class="details-container">
                        <h3>Customer Details</h3>
                        <hr>
                        <h5>Name</h5>
                        <div class="name">
                            <h3>John</h3>
                            <h3>Doe</h3>
                        </div>
                        <div class="name">
                            <h5>Email</h5>
                            <h5>Phone Number</h5>
                        </div>
                        <div class="name">
                            <h3>johndoe@gmail.com</h3>
                            <h3>08101234567</h3>
                        </div>
                    </div>
                </div>

                <div class="customer-details-card">
                    <div class="details-container">
                        <h3>Customer Details</h3>
                        <hr>
                        <h5>Name</h5>
                        <div class="name">
                            <h3>John</h3>
                            <h3>Doe</h3>
                        </div>
                        <div class="name">
                            <h5>Email</h5>
                            <h5>Phone Number</h5>
                        </div>
                        <div class="name">
                            <h3>johndoe@gmail.com</h3>
                            <h3>08101234567</h3>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="bank-card">
                    <div class="details-container">
                        <h3>Bank(s) Involve</h3>
                        <hr>
                        <h5>United Bank for Africa</h5>
                        <h3>Ice Care Nig Ltd</h3>
                        <h3>012345678</h3>
                        <h3>350,000</h3>
                        <br>
                        <h3>Bank(s) Involve</h3>
                        <hr>
                        <h5>United Bank for Africa</h5>
                        <h3>Ice Care Nig Ltd</h3>
                        <h3>012345678</h3>
                        <h3>350,000</h3>
                        <br>
                        <h3>Bank(s) Involve</h3>
                        <hr>
                        <h5>United Bank for Africa</h5>
                        <h3>Ice Care Nig Ltd</h3>
                        <h3>012345678</h3>
                        <h3>350,000</h3>
                        <br>
                    </div>
                </div>
            </section>

        </div>

    </div>

</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.transfer_details {
    padding-bottom: 10px;
    padding-right: 15px;
    color: black;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    padding-top: 40px;
    overflow-x: auto;
    width: 100vw;
    height: 100vh;

}

.header-section {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    flex-direction: column;
}

.header {
    display: flex;
    flex-wrap: wrap;

}

.title {
    flex-grow: 1;
}

.back-button {
    font-size: 18px;
    border: none;
    background: none;
    cursor: pointer;
    color: #A90836;
    padding-right: 20px;
}

.details-section {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    width: 70%;
    padding: 8px;
    border-radius: 8px;
    height: auto;
}

.general {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.customer-details-card {
    background-color: #FCF3F4;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    padding: 10px;
    margin-bottom: 15px;
    flex-wrap: wrap;
    display: flex;
    height: fit-content;
}

.details-container {
    background-color: #f9f9f9;
    padding: 15px;
    margin: 5px;
}

.bank-card {
    text-align: left;
    width: auto;
    height: fit-content;
    background-color: #fde7e7;
    padding: 5px;
}

.details-container {
    margin: 2px;
}

.name {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>